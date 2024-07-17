const GITHUB_USERNAME = "karsonkalt";

type GitHubEvent = {
  actor: {
    id: number;
    login: string;
    display_login: string;
    gravatar_id: string;
    url: string;
  };
  created_at: string;
  id: string;
  payload: {
    repository_id: number;
    push_id: number;
    size: number;
    distinct_size: number;
    ref: string;
  };
  public: boolean;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  type: string;
};

export const addGithubStatus = () => {
  const url = `https://api.github.com/users/${GITHUB_USERNAME}/events/public`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        return;
      }
      const latestEvent = data[0] as GitHubEvent;
      const latestGithubInteractionDate = new Date(latestEvent.created_at);
      const githubStatusElement = document.getElementById("github-status");
      if (githubStatusElement) {
        const formattedDate = latestGithubInteractionDate.toLocaleString(
          "default",
          {
            month: "long",
            day: "numeric",
            hour: "numeric",
            hour12: true,
          }
        );
        githubStatusElement.innerHTML = `Last seen on GitHub: ${formattedDate}`;
      }
    })
    .catch((error) => {
      console.error("Error fetching activity", error.message);
    });
};
