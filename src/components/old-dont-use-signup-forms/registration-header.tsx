export default function RegistrationHeader({
  step,
  title,
}: {
  step: number;
  title: string;
}) {
  return (
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-darkest-green">
      <span className="w-6 h-6 rounded-full bg-medium-green text-primary-white flex items-center justify-center text-sm">
        {step}
      </span>
      {title}
    </h3>
  );
}
