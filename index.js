function removeLinkedInPosts() {
  const BLOCKED_WORDS = [
    "return to office",
    "RTO",
    "remote work",
    "work from home",
    "back to office",
    "office return",
  ];

  const posts = document.querySelectorAll('div[data-id^="urn:li:activity:"]');

  posts.forEach((post) => {
    const description = post.querySelector(
      ".feed-shared-update-v2__description-wrapper"
    );

    if (description) {
      const textContent = description.innerText.toLowerCase();
      if (
        BLOCKED_WORDS.some((keyword) =>
          textContent.includes(keyword.toLowerCase())
        )
      ) {
        post.remove();
      }
    }
  });
}

removeLinkedInPosts();
