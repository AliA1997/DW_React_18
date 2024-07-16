import { useField } from "formik";
import { useEffect, useMemo, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  Form,
  Icon,
  Label,
} from "semantic-ui-react";

interface Props {
  name: string;
}

export default function ColorSelector({ name }: Props) {
  const [field, meta, helpers] = useField(name!);
  const [activeIndex, setActiveIndex] = useState<number | number[]>(0);
  const [color, setColor] = useColor(field.value || "#000000");
  const handleAccordionClick = () => {
    setActiveIndex(activeIndex === 0 ? 1 : 0);
  };

  const isActive = useMemo(() => activeIndex === 1, [activeIndex]);

  useEffect(() => {
    helpers.setValue(color.hex);
  }, [color]);

  return (
    <Accordion
      defaultActiveIndex={1}
      style={{ marginBottom: "1rem" }}
      styled
    >
      <AccordionTitle onClick={handleAccordionClick}>
        Customer Favorite Color: {field.value}
        {/* <br /> */}
        {/* Select a Color */}
        {isActive ? <Icon name="angle down" /> : <Icon name="angle up" />}
      </AccordionTitle>
      <AccordionContent active={isActive}>
        <Form.Field error={meta.touched && !!meta.error}>
          <ColorPicker color={color} onChange={setColor} />
          {meta.touched && meta.error ? (
            <Label basic color="red">
              {meta.error}
            </Label>
          ) : null}
        </Form.Field>
      </AccordionContent>
    </Accordion>
  );
}
