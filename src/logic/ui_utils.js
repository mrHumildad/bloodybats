export const playerStars = (player) => {
  const attributes = player.attributes || {};
  // Convert attributes object to array of values
  const attributeValues = Object.values(attributes);
  if (!attributeValues || attributeValues.length === 0) {
    return '☆☆☆☆☆'; // Return empty stars
  }
  const starsSum = attributeValues.reduce((sum, value) => {
    if (value >= 12) return sum + 5;
    if (value >= 10) return sum + 4;
    if (value >= 8) return sum + 3;
    if (value === 6) return sum + 2;
    if (value === 4) return sum + 1;
    return sum;
  }, 0);
  
  const averageStars = starsSum / attributeValues.length;
  
  // Convert averageStars (0-5 scale) to star string with half stars
  const fullStars = Math.floor(averageStars);
  const hasHalfStar = (averageStars - fullStars) >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let result = '';
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    result += '★';
  }
  // Add half star if needed
  if (hasHalfStar) {
    result += '½';
  }
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    result += '☆';
  }
  
  return result;
}