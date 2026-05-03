import { useState, useEffect } from "react";

const REPOS = [
  { id: "app",     owner: "NetherDevMc", repo: "NetherLink",           label: "App",        color: "violet" },
  { id: "website", owner: "NetherDevMc", repo: "NetherLinkWebsite",    label: "Website",    color: "blue"   },
  { id: "geyser",  owner: "NetherDevMc", repo: "NetherLinkGeyser",     label: "Geyser",     color: "emerald"},
  { id: "bot",     owner: "NetherDevMc", repo: "NetherLinkDiscordBot",  label: "Discord Bot",color: "indigo" },
];

const IGNORE_PATTERNS = [
  /^merge branch/i,
  /^merge pull request/i,
  /^update readme/i,
  /^create robots\.txt/i,
  /^delete robots\.txt/i,
  /build fix/i,
  /^bump version/i,
];

function isInteresting(message) {
  return !IGNORE_PATTERNS.some(p => p.test(message));
}

export function useChangelog({ perRepo = 8, total = 12 } = {}) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.allSettled(
          REPOS.map(({ owner, repo }) =>
            fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perRepo}`)
              .then(r => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))
          )
        );

        const all = [];
        results.forEach((result, i) => {
          if (result.status !== "fulfilled") return;
          const repoMeta = REPOS[i];
          for (const commit of result.value) {
            const message = commit.commit?.message?.split("\n")[0]?.trim() || "";
            if (!message || !isInteresting(message)) continue;
            all.push({
              id:      commit.sha,
              sha:     commit.sha.slice(0, 7),
              message,
              date:    commit.commit?.author?.date || commit.commit?.committer?.date,
              author:  commit.commit?.author?.name || "Unknown",
              avatar:  commit.author?.avatar_url || null,
              url:     commit.html_url,
              repo:    repoMeta,
            });
          }
        });

        // Sorteer nieuwste eerst, begrens op `total`
        all.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (!cancelled) {
          setEntries(all.slice(0, total));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) { setError(String(err)); setLoading(false); }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [perRepo, total]);

  return { entries, loading, error };
}

export { REPOS };