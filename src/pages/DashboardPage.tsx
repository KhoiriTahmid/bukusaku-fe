import { useState } from "react";
import dayjs from "dayjs";
import { Card, Col, Row, Select, Skeleton, Statistic, Typography } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSummary } from "@/features/dashboard/hooks";
import {
  CATEGORY_GROUPED_OPTIONS,
  getCategory,
} from "@/features/transactions/constants";
import { rupiah } from "@/lib/format";
import { CustomHeaderSection } from "@/components/CustomHeader";

function Delta({
  cur,
  prev,
  upIsGood,
}: {
  cur: number;
  prev: number;
  upIsGood: boolean;
}) {
  if (!prev)
    return (
      <Typography.Text type="secondary">No data last month</Typography.Text>
    );
  const pct = ((cur - prev) / prev) * 100;
  const good = upIsGood ? pct >= 0 : pct <= 0;
  return (
    <Typography.Text type={good ? "success" : "danger"}>
      {pct >= 0 ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}% vs last month
    </Typography.Text>
  );
}

export default function DashboardPage() {
  const [category, setCategory] = useState<string>();
  const { data, isLoading, isFetching } = useSummary(category);

  const categoryLabel = category
    ? (getCategory(category)?.label ?? category)
    : undefined;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 32,
        }}
      >
        <CustomHeaderSection
          title="Dashboard"
          subtitle="View Analithycs"
          rightAction={
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="All categories"
              style={{ width: 240 }}
              value={category}
              onChange={setCategory}
              options={CATEGORY_GROUPED_OPTIONS}
            />
          }
        />
      </div>

      {isLoading || !data ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card loading={isFetching}>
              <Statistic
                title={
                  categoryLabel ? `Balance · ${categoryLabel}` : "Total balance"
                }
                value={data.balance}
                formatter={(v) => rupiah(v as number)}
                valueStyle={{
                  color: data.balance >= 0 ? "#389e0d" : "#cf1322",
                }}
              />
              <Typography.Text type="secondary">All time</Typography.Text>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card loading={isFetching}>
              <Statistic
                title="Income this month"
                value={data.currentMonth.income}
                formatter={(v) => rupiah(v as number)}
              />
              <Delta
                cur={data.currentMonth.income}
                prev={data.previousMonth.income}
                upIsGood
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card loading={isFetching}>
              <Statistic
                title="Expense this month"
                value={data.currentMonth.expense}
                formatter={(v) => rupiah(v as number)}
              />
              <Delta
                cur={data.currentMonth.expense}
                prev={data.previousMonth.expense}
                upIsGood={false}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card
              title={`Income vs expense (6 months)${categoryLabel ? ` · ${categoryLabel}` : ""}`}
              loading={isFetching}
            >
              <div style={{ height: 320 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={data.monthly.map((m) => ({
                      ...m,
                      label: dayjs(`${m.month}-01`).format("MMM YY"),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `${v / 1000}k`} width={50} />
                    <Tooltip formatter={(v) => rupiah(v as number)} />
                    <Legend />
                    <Bar
                      dataKey="income"
                      name="Income"
                      fill="#52C41A"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      name="Expense"
                      fill="#FF4D4F"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
