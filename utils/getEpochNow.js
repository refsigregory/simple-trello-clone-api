const getEpochNow = () => {
  return Math.floor(Date.now() / 1000)
};

export default getEpochNow;