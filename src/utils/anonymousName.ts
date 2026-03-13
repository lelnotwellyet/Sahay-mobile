const adjectives = [
  'Blue', 'Silent', 'Calm', 'Gentle', 'Brave',
  'Quiet', 'Kind', 'Soft', 'Warm', 'Clear',
  'Swift', 'Bold', 'Wise', 'Free', 'Pure'
];

const animals = [
  'Fox', 'Deer', 'Owl', 'Bear', 'Wolf',
  'Hawk', 'Dove', 'Swan', 'Lion', 'Eagle',
  'Tiger', 'Panda', 'Koala', 'Lynx', 'Crane'
];

export const generateAlias = (): string => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}${animal}#${num}`;
};