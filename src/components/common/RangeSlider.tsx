import { formatMoney } from "@/utils/format";
import { Slider, styled } from "@mui/material";
import { FC } from "react";

const StyledSlider = styled(Slider)<{ slidercolor?: string }>(({ slidercolor }) => ({
  color: slidercolor || "black",
  height: 4,
  "& .MuiSlider-rail": {
    opacity: 1,
    backgroundColor: "#e6ecf1",
  },
  "& .MuiSlider-thumb": {
    height: 33,
    width: 33,
    backgroundColor: "#fff",
    border: "4px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
  },
  "& .MuiSlider-mark": {
    height: 14,
    width: 14,
    borderRadius: "50%",
    backgroundColor: "#e6ecf1",
    marginLeft: -12,
  },
  "& .MuiSlider-markActive": {
    backgroundColor: slidercolor || "black",
  },
  "& .MuiSlider-markLabel": {
    transform: "translateX(-90%)",
    '&[data-index="0"]': {
      transform: "translateX(-7px)",
    },
  },
}));

const RangeSlider: FC<{
  min: number;
  max: number;
  step?: number;
  value: number;
  color?: string;
  formatLabel?: (value: number) => string;
  onChange(value: number): void;
}> = ({ min, max, step, color, value, onChange, formatLabel = formatMoney }) => {
  return (
    <StyledSlider
      min={min}
      max={max}
      step={step}
      value={value}
      slidercolor={color}
      onChange={(_, value) => onChange(value as number)}
      marks={[
        { value: min, label: formatLabel(min) },
        { value: max, label: formatLabel(max) },
      ]}
    />
  );
};

export default RangeSlider;
