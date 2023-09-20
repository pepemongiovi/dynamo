import { Radio, RadioProps, styled } from "@mui/material";
import { FC } from "react";

type RadioInputProps = Omit<RadioProps, "color"> & {
  color?: string;
  isCheckedColor?: string;
};
const RadioInput: FC<RadioInputProps> = ({
  color = "#595959",
  isCheckedColor = "#3fc85d",
  ...props
}) => {
  const CustomRadio = styled(Radio)`
    color: ${color};
    &.Mui-checked {
      color: ${isCheckedColor};
    }
  `;

  return <CustomRadio {...props} size="medium" />;
};

export default RadioInput;
