interface SectionHeadingProps {
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
      <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-8" />
    </>
  );
};

export default SectionHeading;
