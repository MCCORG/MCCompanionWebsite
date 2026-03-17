import { useEffect, useState } from "react";
import { FaTrophy, FaServer, FaGlobeEurope, FaGlobeAmericas, FaSync } from "react-icons/fa";

function MetricsList({ endpoint, region }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(endpoint)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [endpoint, refetchIndex]);

  return (
    <div className="bg-white/40 glass-tile shadow-lg border border-white/20 rounded-2xl p-6 sm:p-8 transition">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-900 flex items-center gap-3">
          {region === "EU" ? <FaGlobeEurope /> : <FaGlobeAmericas />}
          Top servers ({region})
        </h2>
        <button
          className="ml-auto text-blue-700 hover:text-blue-900 bg-white/60 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2 text-sm shadow hover:bg-blue-100 transition"
          onClick={() => setRefetchIndex((i) => i + 1)}
          aria-label="Refresh"
          disabled={loading}
          title="Refresh"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      <div className="relative overflow-x-auto">
        {loading ? (
          <div className="py-6 text-blue-600 text-center font-medium">Loading...</div>
        ) : (
          <table className="w-full min-w-[360px] text-blue-900 rounded-xl overflow-hidden">
            <thead>
              <tr className="text-left text-blue-800 bg-blue-100/40 border-b border-blue-100/20">
                <th className="p-2 sm:p-3 rounded-tl-xl w-10 sm:w-12">#</th>
                <th className="p-2 sm:p-3 max-w-[120px] sm:max-w-none">
                  <FaServer className="inline mb-1 mr-1" />
                  <span className="truncate">Server IP</span>
                </th>
                <th className="p-2 sm:p-3 text-right rounded-tr-xl">
                  <FaTrophy className="inline mb-1 mr-1" />
                  Joins
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.ip}
                  className={`
                    border-b border-white/20
                    ${idx < 3 ? "bg-yellow-200/30" : "hover:bg-cyan-200/20"} 
                    ${idx === 0 && "font-extrabold"}
                  `}
                >
                  <td className="p-2 sm:p-3 font-bold text-center text-lg">
                    {idx + 1}
                  </td>
                  <td className="p-2 sm:p-3 font-mono text-blue-800 break-all max-w-[120px] sm:max-w-none">
                    {row.ip}
                  </td>
                  <td className="p-2 sm:p-3 text-right font-bold text-blue-900">
                    {row.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style jsx="true">{`
        .glass-tile {
          background: linear-gradient(110deg,rgba(255,255,255,0.72) 65%,rgba(160,222,253,0.11) 100%);
          backdrop-filter: blur(15px);
        }
      `}</style>
    </div>
  );
}

export default function MetricsPage() {
  const endpoints = {
    EU: "https://eumetrics.netherlink.net/api/top",
    US: "https://usmetrics.netherlink.net/api/top"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200/40 via-white/80 to-cyan-200/60 px-2 py-12 pt-20">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-blue-800 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 drop-shadow-sm">
          NetherLink Server Metrics
        </h1>
        <p className="text-blue-700 font-medium text-center max-w-xl mx-auto mb-5">
          See which servers are trending! These rankings are based on recent connections (<b>joins</b>) in the NetherLink app.
        </p>
      </div>
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <MetricsList endpoint={endpoints.EU} region="EU" />
        </div>
        <div className="flex-1">
          <MetricsList endpoint={endpoints.US} region="US" />
        </div>
      </div>
    </div>
  );
}