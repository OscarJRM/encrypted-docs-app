
export class VigenereExtendido {
  
  /**
   * Cifra texto con Vigenère usando todos los caracteres imprimibles ASCII
   * @param texto - Texto a cifrar (acepta tildes, espacios, símbolos, etc.)
   * @param clave - Clave de cifrado
   * @returns Texto cifrado en Base64
   */
  static cifrar(texto: string, clave: string): string {
    if (!texto || !clave) {
      throw new Error('Texto y clave son requeridos');
    }

    const textoCifrado: number[] = [];
    const claveExpandida = this.expandirClave(clave, texto.length);

    for (let i = 0; i < texto.length; i++) {
      const charTexto = texto.charCodeAt(i);
      const charClave = claveExpandida.charCodeAt(i);
      
      // Suma de códigos ASCII con módulo 256 (todos los caracteres)
      const charCifrado = (charTexto + charClave) % 256;
      textoCifrado.push(charCifrado);
    }

    // Convertir a Base64 para transmisión segura
    return this.arrayToBase64(textoCifrado);
  }

  /**
   * Descifra texto cifrado con Vigenère
   * @param textoCifrado - Texto cifrado en Base64
   * @param clave - Clave de descifrado
   * @returns Texto original
   */
  static descifrar(textoCifrado: string, clave: string): string {
    if (!textoCifrado || !clave) {
      throw new Error('Texto cifrado y clave son requeridos');
    }

    const arrayCifrado = this.base64ToArray(textoCifrado);
    const claveExpandida = this.expandirClave(clave, arrayCifrado.length);
    
    let textoDescifrado = '';

    for (let i = 0; i < arrayCifrado.length; i++) {
      const charCifrado = arrayCifrado[i];
      const charClave = claveExpandida.charCodeAt(i);
      
      // Resta de códigos ASCII con módulo 256
      let charOriginal = (charCifrado - charClave) % 256;
      
      // Manejo de números negativos
      if (charOriginal < 0) {
        charOriginal += 256;
      }
      
      textoDescifrado += String.fromCharCode(charOriginal);
    }

    return textoDescifrado;
  }

  /**
   * Expande la clave para que tenga la misma longitud que el texto
   */
  private static expandirClave(clave: string, longitud: number): string {
    let claveExpandida = '';
    for (let i = 0; i < longitud; i++) {
      claveExpandida += clave[i % clave.length];
    }
    return claveExpandida;
  }

  /**
   * Convierte array de números a Base64
   */
  private static arrayToBase64(array: number[]): string {
    // Convertir array a string binario
    const binaryString = String.fromCharCode(...array);
    
    // Convertir a Base64 (compatible con navegador y Node.js)
    if (typeof window !== 'undefined') {
      // Navegador
      return btoa(binaryString);
    } else {
      // Node.js
      return Buffer.from(binaryString, 'binary').toString('base64');
    }
  }

  /**
   * Convierte Base64 a array de números
   */
  private static base64ToArray(base64: string): number[] {
    let binaryString: string;
    
    if (typeof window !== 'undefined') {
      // Navegador
      binaryString = atob(base64);
    } else {
      // Node.js
      binaryString = Buffer.from(base64, 'base64').toString('binary');
    }
    
    const array: number[] = [];
    for (let i = 0; i < binaryString.length; i++) {
      array.push(binaryString.charCodeAt(i));
    }
    return array;
  }
}
