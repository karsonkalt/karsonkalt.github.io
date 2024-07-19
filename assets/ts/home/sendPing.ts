export const sendPing = (message: string) => {
  if (!message) {
    throw new Error("Message is required");
  }
  fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: "a636654jy5djvuc69zgnu4i9rwsx1i",
      user: "u1vakvq997948t561jq896gwkw2w81",
      message: message,
    }),
  });
};
