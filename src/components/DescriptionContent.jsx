import { formatDescription } from "../utils/description.js";

export default function DescriptionContent({ description }) {
  const sections = formatDescription(description);
  if (!sections.length)
    return (
      <p className="desc">
        No extra description was given. The problem statement above is the full brief — you can
        define the scope yourself.
      </p>
    );

  return (
    <div className="description-sections">
      {sections.map((section, index) => (
        <section className="description-section" key={`${section.heading || "intro"}-${index}`}>
          {section.heading && <h5>{section.heading}</h5>}
          {section.list ? (
            <>
              {section.list.introduction && <p className="desc">{section.list.introduction}</p>}
              <ul>
                {section.list.items.map((item, itemIndex) => (
                  <li key={`${item.label}-${itemIndex}`}>
                    <strong>{item.label}:</strong>
                    {item.text ? ` ${item.text}` : ""}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="desc">{section.text}</p>
          )}
        </section>
      ))}
    </div>
  );
}
