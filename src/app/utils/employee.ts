export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  const day = date.getUTCDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getUTCFullYear();

  return `${month} ${day}, ${year}`;
}

export function formatWorkAuth(workAuth: string): string {
  const workAuthMap: Map<string, string> = new Map([
    ['PENDING', 'Pending'],
    ['CITIZEN', 'Citizen'],
    ['GREEN_CARD', 'Green Card'],
    ['H1B', 'H1B'],
    ['L2', 'L2'],
    ['F1_CPT_OPT', 'F1 (CPT/OPT)'],
    ['H4', 'H4'],
    ['OTHER', 'Other'],
  ]);

  return workAuthMap.get(workAuth) as string;
}
