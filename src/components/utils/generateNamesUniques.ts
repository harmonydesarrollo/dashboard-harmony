
export const generateUniqueId = (): string => {
  
  // Obtener el timestamp actual en milisegundos
  const timestamp = new Date().getTime();
  
  // Obtener un valor aleatorio entre 0 y 0xFFFFFFFF
  const randomPart = Math.floor(Math.random() * 0xFFFFFFFF).toString(16);
  
  // Asegurarse de que el valor aleatorio tenga 8 caracteres
  const paddedRandomPart = randomPart.padStart(8, '0');
  
  // Combinar el timestamp y el valor aleatorio
  return `${timestamp}-${paddedRandomPart}`;
}
