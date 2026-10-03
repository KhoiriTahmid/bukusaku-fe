import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import Col from "antd/es/col";
import Input from "antd/es/input";
import Row from "antd/es/row";
import Select from "antd/es/select";
import Typography from "antd/es/typography";
import styled from "styled-components";

type FilterOption = {
  value: string;
  label: string;
};

export type IFilter = {
  type: "search" | "select";
  key: string;
  label: string;
  value?: any;
  onChange: (value: any) => void;
  placeholder?: string;
  options?: {
    value: string;
    label: string;
  }[];
  mode?: "multiple" | "tags";
  colSpan?: number;
  allowClear?: boolean;
  height?: number;
};

type Props = {
  filters: IFilter[][];
  equalWidth?: boolean;
};

const BASE_INPUT_HEIGHT = 32;
const HEIGHT_INCREASE = 4;
const DEFAULT_HEIGHT = BASE_INPUT_HEIGHT + HEIGHT_INCREASE;

export const BaseFilter = ({ filters, equalWidth = false }: Props) => {
  return (
    <div style={{ marginTop: 24, marginBottom: 24 }}>
      {filters.map((rowFilters, rowIndex) => (
        <StyledRow key={rowIndex} gutter={[12, 12]}>
          {rowFilters.map((filter) => {
            const colProps = equalWidth
              ? { flex: 1 }
              : { span: filter.colSpan ?? 8 };

            return (
              <Col {...colProps} key={filter.key}>
                <Typography.Text className="filter-label">
                  {filter.label}
                </Typography.Text>

                {filter.type === "search" && (
                  <SearchInput
                    $height={filter.height}
                    placeholder={filter.placeholder || "Search by keyword"}
                    prefix={<SearchOutlined style={{ color: "#BFBFBF" }} />}
                    allowClear={filter.allowClear}
                    value={filter.value ?? ""}
                    onChange={(e) => {
                      filter.onChange(e.target.value);
                    }}
                  />
                )}

                {filter.type === "select" && (
                  <FilterWrapper>
                    <StyledSelect
                      $height={filter.height}
                      value={filter.value}
                      allowClear={filter.allowClear}
                      placeholder={filter.placeholder || filter.label}
                      suffixIcon={<DownOutlined style={{ color: "#BFBFBF" }} />}
                      mode={filter.mode}
                      options={filter.options}
                      onChange={(value) => {
                        filter.onChange(value);
                      }}
                    />
                  </FilterWrapper>
                )}
              </Col>
            );
          })}
        </StyledRow>
      ))}
    </div>
  );
};

const SearchInput = styled(Input)<{ $height?: number }>`
  display: flex;
  align-items: center;
`;

const StyledSelect = styled(Select)<{ $height?: number }>`
  width: 100%;

  .ant-select-selector {
    height: ${({ $height }) => $height ?? DEFAULT_HEIGHT}px !important;

    display: flex;
    align-items: center;
  }

  .ant-select-selection-item,
  .ant-select-selection-placeholder {
    line-height: ${({ $height }) => $height ?? DEFAULT_HEIGHT}px !important;
  }
`;

const StyledRow = styled(Row)`
  .filter-label {
    display: block;
    margin-bottom: 8px;
    color: #595959;
    font-weight: 600;
  }
`;

const FilterWrapper = styled.div`
  width: 100%;

  .ant-select-selection-placeholder {
    color: #000 !important;
    opacity: 1;
  }
`;

export default BaseFilter;
