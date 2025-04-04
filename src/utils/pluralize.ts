export function pluralize(count: number, single: string, plural: string)
{
  return count === 1 ? single : plural;
}
