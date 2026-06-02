export const sendEmail = async (resetLink: string, email: string) => {
  console.log(`Reset link for ${email}: ${resetLink}`);
  return { messageId: "placeholder" };
};
