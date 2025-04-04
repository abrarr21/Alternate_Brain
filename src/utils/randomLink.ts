export const randomLink = (len: number) => {
  let option = "abcdefghijklmnopqrstuvwxyz1234567890";
  let length = option.length;

  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += option[Math.floor(Math.random() * length)];
  }

  return ans;
};
