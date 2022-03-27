const waitUntil = (callback: () => boolean) => {
  return new Promise<void>((resolve) => {
    const timer = setInterval(() => {
      if (callback()) {
        clearInterval(timer);
        resolve();
      }
    }, 16);
  });
};

export default waitUntil;
