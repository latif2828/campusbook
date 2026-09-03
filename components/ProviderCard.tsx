type Props={
  name:string;
  category:string;
  price:string;
}

export default function ProviderCard({
  name,
  category,
  price,
}:Props){

  return(
    <div className="card p-5">

      <div className="w-full h-40 bg-purple-100 rounded-xl mb-4"/>

      <h3 className="font-bold text-lg">{name}</h3>

      <p className="text-gray-500">{category}</p>

      <div className="flex justify-between mt-4 items-center">
        <span className="font-semibold">{price}</span>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Book
        </button>
      </div>

    </div>
  )
}