import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Input,
  Progress,
  Radio,
  Typography,
} from "antd";
import { checkMatch, MatchMode } from "@/features/character-match/api";
import { getErrorMessage } from "@/lib/errors";

export default function CharacterMatchPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const mode = Form.useWatch("mode", form) as MatchMode | undefined;

  const mutation = useMutation({
    mutationFn: checkMatch,
    onError: (e) => message.error(getErrorMessage(e, "Failed to check")),
  });
  const result = mutation.data;

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        Character Match
      </Typography.Title>

      <Card style={{ maxWidth: 640 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ mode: "SENSITIVE" }}
          onFinish={(v) => mutation.mutate(v)}
        >
          <Form.Item
            name="input1"
            label="Input 1"
            rules={[{ required: true, whitespace: true, message: "Required" }]}
          >
            <Input placeholder="ABBCD" />
          </Form.Item>
          <Form.Item
            name="input2"
            label="Input 2"
            rules={[{ required: true, whitespace: true, message: "Required" }]}
          >
            <Input placeholder="Gallant Duck" />
          </Form.Item>
          <Form.Item name="mode" label="Type">
            <Radio.Group>
              <Radio value="SENSITIVE">Case sensitive</Radio>
              <Radio value="INSENSITIVE">Case insensitive</Radio>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Check
          </Button>
        </Form>

        {result && (
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Progress
              type="circle"
              percent={result.percentage}
              format={(p) => `${p}%`}
            />
            <Alert
              style={{ marginTop: 16 }}
              type="info"
              showIcon
              message={`${result.matched} of ${result.total} characters from input 1 appear in input 2 (${
                mode === "INSENSITIVE" ? "case insensitive" : "case sensitive"
              }).`}
            />
          </div>
        )}
      </Card>
    </>
  );
}
