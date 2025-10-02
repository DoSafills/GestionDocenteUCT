type Props = {
  title: string;
  value: string;
};

function Card({ title, value }: Props) {
  return (
    <div className="bg-gray-100 text-black p-4 rounded-lg shadow flex flex-col">
      <span className="text-gray-600 text-sm">{title}</span>
      <span className="text-2xl font-bold mt-2">{value}</span>
    </div>
  );
}

export default Card;
