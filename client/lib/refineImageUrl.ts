export function refineUrl(imageUrl: string) {
  const slicedText = imageUrl.split("?")[0];
  return slicedText;
}
