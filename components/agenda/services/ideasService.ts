// Service for generating radio program theme ideas
export const generateThemeIdeas = async (theme: string, program: string, instructions: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Ideas generadas para el tema "${theme}" en el programa "${program}".\n\nInstrucciones: ${instructions}`);
    }, 1500);
  });
};
