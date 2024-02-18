import styled from '@emotion/styled';
import AppColor from '@styles/AppColor';
import { CSSProperties, DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react';

export interface TextInputProps {
  wrapperStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  endAdornment?: ReactElement;
  error?: boolean;
  helperText?: string;
}

export default function TextInput({
  wrapperStyle,
  containerStyle,
  error,
  helperText,
  endAdornment,
  ...rest
}: TextInputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <Wrapper style={wrapperStyle}>
      <Container style={containerStyle}>
        <Input {...rest} />
        {endAdornment && endAdornment}
      </Container>
      {error && helperText && <ErrorText>{helperText}</ErrorText>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid ${AppColor.border.gray};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: ${AppColor.background.lightgray};
`;

const Input = styled.input`
  color: ${AppColor.text.main};
  background-color: ${AppColor.background.lightgray};
  border: none;
  width: 100%;
  height: 100%;
  font-weight: 500;
  flex: 1;
  &:focus {
    outline: none;
  }
  
  &::placeholder{
		color: ${AppColor.text.lightgray};
	}
`;

const ErrorText = styled.p`
  color: ${AppColor.text.error};
  font-size: 12px;
  line-height: 1.5;
  margin: 6px 0 2px;
  position: absolute;
`;
