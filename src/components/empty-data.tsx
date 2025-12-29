export default function EmptyData({ message }: { message: string }) {
    return (
        <div className="flex w-full h-[50%] items-center justify-center items-center rounded-xl border border-dashed border-indigo-200 bg-white py-10">
            <p className="text-sm sm:text-[16px] text-indigo-300 italic">
                {message}
            </p>
        </div>
    )
}