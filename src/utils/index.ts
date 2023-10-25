export async function waitForNSeconds(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export function enumValuesToString(enumObject: any): string {
  return Object.values(enumObject).join(' or ');
}
