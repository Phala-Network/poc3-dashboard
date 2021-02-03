import BN from "bn.js";

export const bn1e8 = new BN(10).pow(new BN(8));

export const defaultData = {
  onlineTime: "[]",
  dashboard: [
    {
      targetAddress: "43DHoYgGL3h63M8vt4kC7yGgdUCg2r6yWAhT1E6qZXYtEfNn",
      targetFire: "43294450161834906",
      targetFireRatio: "0.00%",
      targetState: [
        {
          stashAddress: "44CmwGtpxcNeCPMcpLvv68CrWqEUBkh3Po5J6d4PvSC6TWyE",
          stashState: {
            controller: "43DHoYgGL3h63M8vt4kC7yGgdUCg2r6yWAhT1E6qZXYtEfNn",
            overallScore: 280,
          },
        },
      ],
    },
  ],
};

export function formatFire(rawFire) {
  return (new BN(rawFire).div(bn1e8).toNumber() / 10000.0).toFixed(4);
}

export function totalHashPower(stashes) {
  return stashes.reduce((acc, x) => acc + x.stashState.overallScore, 0);
}

export function perc(x) {
  let value = Math.pow(x, 0.8);
  value = (100 * value) | 0;
  value = value > 100 ? 100 : value;
  return `${value}%`;
}

export function noop() {}

export function formatNumber (num) {
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatPercentage (num) {
  return `${num * 100 / 1.0000}%`
}
