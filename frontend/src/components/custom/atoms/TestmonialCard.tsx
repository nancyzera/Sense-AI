const TestimonialCard = ({
  name,
  username,
  avatar,
  text,
}: {
  name: string;
  username: string;
  avatar: string;
  text: string[];
}) => (
  <div className="relative text-left transition-transform cursor-pointer scale-100 hover:scale-[102%] duration-300">
    <div className="bg-[#202735] transition-all rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-2">
        <img
          alt={`${name}'s avatar`}
          loading="lazy"
          width="48"
          height="48"
          className="size-12 mr-3 rounded-full"
          src={avatar}
        />
        <div>
          <p className="font-bold text-[15px] text-white">{name}</p>
          <p className="text-xs md:text-sm text-muted-foreground">@{username}</p>
        </div>
      </div>
      <div className="text-xs md:text-sm text-muted-foreground mt-2">
        {text.map((line, index) => (
          <div key={index} className="mt-4">
            {line}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialCard