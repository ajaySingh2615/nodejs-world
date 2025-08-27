export default function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list!</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const packingPercentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {packingPercentage === 100
          ? "You have got everything packed! Ready to go!"
          : `You have ${numItems} items in your list, and you already packed
        ${numPacked} (${packingPercentage}%)`}
      </em>
    </footer>
  );
}
