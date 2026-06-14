import { getCountries } from "@/app/_lib/data-service";

async function SelectCountry({ defaultCountry, name, id, className }) {
  const data = await getCountries();

  const countries = Array.isArray(data) ? data : [];

  const selectedCountry = countries.find((c) => c.name === defaultCountry);

  const flag = selectedCountry?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>

      {countries.map((c) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
