import React from "react";
import styled from "styled-components";

export interface CustomHeaderSectionProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const CustomHeaderSection: React.FC<CustomHeaderSectionProps> = ({
  title,
  subtitle,
  rightAction,
}) => {
  return (
    <Container>
      <WrapperTitle>
        <Title>{title}</Title>

        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </WrapperTitle>

      {rightAction && <WrapperAction>{rightAction}</WrapperAction>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WrapperTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 4px;
`;

const WrapperAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.div`
  font-size: ${({ theme }: any) => theme?.fontSize?.title || "24px"};
  font-weight: ${({ theme }: any) => theme?.fontWeight?.bold || "bold"};
  color: ${({ theme }: any) => theme?.colors?.black || "#000000"};
`;

const Subtitle = styled.div`
  font-size: ${({ theme }: any) => theme?.fontSize?.body || "16px"};
  line-height: 1;
  color: ${({ theme }: any) => theme?.colors?.charcoal300 || "darkgrey"};
`;
