"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

type Person = {
  id: number;
  name: string;
  type: "boy" | "girl";
};

type Pair = {
  a?: Person;
  b?: Person;
};

export default function Home() {
  const [teamA, setTeamA] = useState<Person[]>([
    {
      id: 1,
      name: "Boy 1",
      type: "boy",
    },
    {
      id: 2,
      name: "Boy 2",
      type: "boy",
    },
    {
      id: 3,
      name: "Boy 3",
      type: "boy",
    },
    {
      id: 4,
      name: "Boy 4",
      type: "boy",
    },
    {
      id: 5,
      name: "Boy 5",
      type: "boy",
    },
    {
      id: 6,
      name: "Boy 6",
      type: "boy",
    },
    {
      id: 7,
      name: "Boy 7",
      type: "boy",
    },
    {
      id: 8,
      name: "Boy 8",
      type: "boy",
    },
    {
      id: 9,
      name: "Boy 9",
      type: "boy",
    },
    {
      id: 10,
      name: "Boy 10",
      type: "boy",
    },
  ]);
  const [teamB, setTeamB] = useState<Person[]>([
    {
      id: 1,
      name: "Girl 1",
      type: "girl",
    },
    {
      id: 2,
      name: "Girl 2",
      type: "girl",
    },
    {
      id: 3,
      name: "Girl 3",
      type: "girl",
    },
    {
      id: 4,
      name: "Girl 4",
      type: "girl",
    },
    {
      id: 5,
      name: "Girl 5",
      type: "girl",
    },
    {
      id: 6,
      name: "Girl 6",
      type: "girl",
    },
    {
      id: 7,
      name: "Girl 7",
      type: "girl",
    },
    {
      id: 8,
      name: "Girl 8",
      type: "girl",
    },
    {
      id: 9,
      name: "Girl 9",
      type: "girl",
    },
    {
      id: 10,
      name: "Girl 10",
      type: "girl",
    },
  ]);
  const [nextId, setNextId] = useState(1);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  const [rounds, setRounds] = useState<Pair[][]>([]);
  const [opponentBoys, setOpponentBoys] = useState<any>({});
  const [opponentGirls, setOpponentGirls] = useState<any>({});

  const addToTeamA = () => {
    const trimmed = inputA.trim();
    if (!trimmed) return;
    setTeamA((prev) => [...prev, { id: prev.length + 1, name: trimmed, type: "boy" } as Person]);
    setInputA("");
  };

  const addToTeamB = () => {
    const trimmed = inputB.trim();
    if (!trimmed) return;
    setTeamB((prev) => [...prev, { id: prev.length + 1, name: trimmed, type: "girl" } as Person]);
    setInputB("");
  };

  const handleKeyDownA: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addToTeamA();
    }
  };

  const handleKeyDownB: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addToTeamB();
    }
  };

  const shuffleTeam = (team: Person[], setTeam: (people: Person[]) => void) => {
    const copy = [...team];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setTeam(copy);
  };

  const clearTeamA = () => {
    setTeamA([]);
    setInputA("");
  };

  const clearTeamB = () => {
    setTeamB([]);
    setInputB("");
  };

  const generateSpeedDateRound = () => {
    console.log("generateSpeedDateRound");
    if (teamA.length === 0 || teamB.length === 0) return;

    if (teamA.length > teamB.length) {
      const diff = teamA.length - teamB.length;
      for (let i = 0; i < diff; i++) {
        setTeamB((prev) => [...prev, { id: prev.length + 1, name: `Girl ${nextId} (N/A)` } as Person]);
        setNextId((prev) => prev + 1);
      }
    } else if (teamA.length < teamB.length) {
      const diff = teamB.length - teamA.length;
      for (let i = 0; i < diff; i++) {
        setTeamA((prev) => [...prev, { id: prev.length + 1, name: `Boy ${nextId} (N/A)` } as Person]);
        setNextId((prev) => prev + 1);
      }
    }

    const maxLength = Math.max(teamA.length, teamB.length);

    const a = [...teamA];
    const b = [...teamB];

    let roundPairs: any = [];

    for (let i = 0; i < maxLength; i++) {
      let pair: any = [];
      for (let j = 0; j < maxLength; j++) {
        pair.push({
          boy: a[j],
          girl: b[j],
        });
      }
      roundPairs.push(pair);
      b.unshift(b.pop() as Person);
    }

    setRounds(roundPairs);

    let opponentBoysTemp: any = {};
    let opponentGirlsTemp: any = {};

    for (let i = 0; i < teamA.length; i++) {
      opponentBoys[teamA[i].id] = {
        info: teamA[i],
        opponents: [],
      };
    }

    for (let i = 0; i < teamB.length; i++) {
      opponentGirls[teamB[i].id] = {
        info: teamB[i],
        opponents: [],
      };
    }

    for (let i = 0; i < roundPairs.length; i++) {
      for (let j = 0; j < roundPairs[i].length; j++) {
        opponentBoys[roundPairs[i][j].boy.id].opponents.push(roundPairs[i][j].girl);
        opponentGirls[roundPairs[i][j].girl.id].opponents.push(roundPairs[i][j].boy);
      }
    }

    setOpponentBoys(opponentBoysTemp);
    setOpponentGirls(opponentGirlsTemp);

    console.log(opponentBoys);
    console.log(opponentGirls);

    console.log(roundPairs);
  };

  const buildOpponentSheet = (
    opponentsObj: any,
    personType: "boy" | "girl"
  ) => {
    // opponentsObj: { [id]: { info: Person, opponents: Person[] } }
    const entries = Object.values(opponentsObj || {}) as {
      info: Person;
      opponents: Person[];
    }[];
  
    if (!entries.length) {
      return XLSX.utils.aoa_to_sheet([[personType === "boy" ? "Boys" : "Girls"]]);
    }
  
    const maxOpponents = Math.max(
      ...entries.map((e) => (e.opponents ? e.opponents.length : 0))
    );
  
    const blockWidth = 4; // Boy_name / Round_number / Opponent_id / Opponent_name
    const totalCols = entries.length * blockWidth;
    const totalRows = maxOpponents + 2; // 1 header row + N opponent rows
    const rows: (string | number | null)[][] = Array.from(
      { length: totalRows },
      () => Array(totalCols).fill(null)
    );
  
    entries.forEach((entry, idx) => {
      const col = idx * blockWidth;
  
      const isBoySheet = personType === "boy";
      const personHeader = isBoySheet ? "Boy_name" : "Girl_name";
      const oppIdHeader = isBoySheet ? "Girl_id" : "Boy_id";
      const oppNameHeader = isBoySheet ? "Girl_name" : "Boy_name";
  
      // Header row for this block
      rows[0][col + 0] = personHeader;
      rows[0][col + 1] = "Round_number";
      rows[0][col + 2] = oppIdHeader;
      rows[0][col + 3] = oppNameHeader;
  
      // One row per round/opponent
      entry.opponents.forEach((opp, i) => {
        const r = i + 1;
        rows[r][col + 0] = entry.info.name;
        rows[r][col + 1] = i + 1; // round number = index + 1
        rows[r][col + 2] = opp?.id ?? null;
        rows[r][col + 3] = opp?.name ?? null;
      });
    });
  
    return XLSX.utils.aoa_to_sheet(rows);
  };

  const buildRoundsSheet = () => {
    if (!rounds.length) {
      return XLSX.utils.aoa_to_sheet([["No rounds"]]);
    }
  
    const blockWidth = 4; // Boy_id / Boy_name / Girl_id / Girl_name
    const maxPairs = Math.max(...rounds.map((r) => r.length));
    const totalCols = rounds.length * blockWidth;
    const totalRows = maxPairs + 2; // 1 title/header row + N pairs
    const rows: (string | number | null)[][] = Array.from(
      { length: totalRows },
      () => Array(totalCols).fill(null)
    );
  
    rounds.forEach((round, roundIndex) => {
      const col = roundIndex * blockWidth;
  
      // Title for this round
      rows[0][col] = `Round ${roundIndex + 1}`;
  
      // Column headers
      rows[1][col + 0] = "Boy_id";
      rows[1][col + 1] = "Boy_name";
      rows[1][col + 2] = "Girl_id";
      rows[1][col + 3] = "Girl_name";
  
      round.forEach((pair: any, pairIndex: number) => {
        const row = pairIndex + 2;
        const boy = pair.boy as Person | undefined;
        const girl = pair.girl as Person | undefined;
  
        rows[row][col + 0] = boy?.id ?? null;
        rows[row][col + 1] = boy?.name ?? null;
        rows[row][col + 2] = girl?.id ?? null;
        rows[row][col + 3] = girl?.name ?? null;
      });
    });
  
    return XLSX.utils.aoa_to_sheet(rows);
  };

  const exportAllToExcel = () => {
    if (!rounds.length) return;
  
    const wb = XLSX.utils.book_new();
  
    // Sheet 1: Boys opponents (blocks like your screenshot)
    const boysSheet = buildOpponentSheet(opponentBoys, "boy");
    XLSX.utils.book_append_sheet(wb, boysSheet, "Boys opponents");
  
    // Sheet 2: Girls opponents
    const girlsSheet = buildOpponentSheet(opponentGirls, "girl");
    XLSX.utils.book_append_sheet(wb, girlsSheet, "Girls opponents");
  
    // Sheet 3: Rounds, each round in its own 4‑column block
    const roundsSheet = buildRoundsSheet();
    XLSX.utils.book_append_sheet(wb, roundsSheet, "Rounds");
  
    XLSX.writeFile(wb, "speed-date.xlsx");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="w-full max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50 text-center">
          Speed Date Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-2">
          {/* Boys */}
          <section>
            <h2 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3 text-center">
              Boys
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                onKeyDown={handleKeyDownA}
                placeholder="Add name to Boys"
                className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/80"
              />
              <button
                type="button"
                onClick={addToTeamA}
                className="rounded-lg bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!inputA.trim()}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => shuffleTeam(teamA, setTeamA)}
                className="rounded-full bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={teamA.length < 2}
              >
                Shuffle Boys
              </button>
              <button
                type="button"
                onClick={clearTeamA}
                className="rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-medium px-4 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={teamA.length === 0 && !inputA}
              >
                Clear Boys
              </button>
            </div>
            {teamA.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center">
                No one in Boys yet.
              </p>
            ) : (
              <ol className="space-y-2 text-sm">
                {teamA.map((person, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-zinc-800/80 px-3 py-2"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-50">
                        {person.name}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
          <section>
            <h2 className="font-medium text-zinc-900 dark:text-zinc-100 mb-3 text-center">
              Girls
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                onKeyDown={handleKeyDownB}
                placeholder="Add name to Girls"
                className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900/80"
              />
              <button
                type="button"
                onClick={addToTeamB}
                className="rounded-lg bg-zinc-900 text-white text-sm font-medium px-4 py-2 hover:bg-zinc-800 active:bg-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!inputB.trim()}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => shuffleTeam(teamB, setTeamB)}
                className="rounded-full bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={teamB.length < 2}
              >
                Shuffle Girls
              </button>
              <button
                type="button"
                onClick={clearTeamB}
                className="rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-medium px-4 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={teamB.length === 0 && !inputB}
              >
                Clear Girls
              </button>
            </div>
            {teamB.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center">
                No one in Girls yet.
              </p>
            ) : (
              <ol className="space-y-2 text-sm">
                {teamB.map((person, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-zinc-800/80 px-3 py-2"
                  >
                    <span className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white text-xs font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-zinc-900 dark:text-zinc-50">
                        {person.name}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
        <div className="flex justify-center mt-8 gap-3">
          <button
            type="button"
            onClick={generateSpeedDateRound}
            className="rounded-full bg-indigo-600 text-white text-xs font-medium px-4 py-1.5 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={teamA.length === 0 || teamB.length === 0}
          >
            Round Generate
          </button>

          <button
            type="button"
            onClick={exportAllToExcel}
            className="rounded-full bg-zinc-900 text-white text-xs font-medium px-4 py-1.5 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={!rounds.length}
          >
            Export to Excel
          </button>
        </div>
        {
          rounds.map((round, index) => (
            <section className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6" key={index}>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {`Speed Date Round ${index + 1}`}
                </h2>
              </div>
              {round.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Add people to both Boys and Girls, then click{" "}
                  <span className="font-medium">New round</span> to see pairs.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <table className="min-w-full text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/70">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-500">
                          #
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-500">
                          Boys
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-zinc-500">
                          Girls
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        round.map((pair: any, index) => {
                          return (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0
                                  ? "bg-white dark:bg-zinc-900"
                                  : "bg-zinc-50 dark:bg-zinc-900/80"
                              }
                            >
                              <td className="px-3 py-2 text-xs text-zinc-500">
                                {index + 1}
                              </td>
                              <td className="px-3 py-2 text-zinc-900 dark:text-zinc-50">
                                {pair.boy ? (pair.boy as Person).name : <span className="text-zinc-400">—</span>}
                              </td>
                              <td className="px-3 py-2 text-zinc-900 dark:text-zinc-50">
                                {pair.girl ? (pair.girl as Person).name : <span className="text-zinc-400">—</span>}
                              </td>
                            </tr>
                        )
                      })
                    }
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))
        }
      </main>
    </div>
  );
}
