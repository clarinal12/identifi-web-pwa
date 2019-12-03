import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Tooltip } from 'antd';

interface ICustomQuestions {
  isSubmitting: boolean,
  questions: string[],
  mergeQuestionsToState: (values: string[]) => void,
  setFieldValue: (key: string, values: string[]) => void,
  setFieldTouched: (key: string, value?: boolean) => void,
}

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-children {
    display: flex;
  }
`;

const CustomQuestions: React.FC<ICustomQuestions> = ({
  isSubmitting, questions, mergeQuestionsToState, setFieldValue, setFieldTouched,
}) => {
  const [customQuestions, setCustomQuestions] = useState(questions);
  const [questionsCount, setQuestionsCount] = useState(questions.length || 1);
  return (
    <>
      {[...(new Array(questionsCount))].map((_, idx) => (
        <StyledFormItem
          key={idx}
          label={`Question ${idx + 1}`}
        >
          <Input
            size="large"
            className="mr-2"
            disabled={isSubmitting}
            value={customQuestions[idx] || ''}
            placeholder="Enter your question"
            onChange={(e) => {
              const clonedQuestions = [...customQuestions];
              clonedQuestions[idx] = e.target.value;
              setFieldTouched('questions');
              setFieldValue('questions', clonedQuestions);
              setCustomQuestions(clonedQuestions);
              mergeQuestionsToState(clonedQuestions);
            }}
          />
          <Tooltip title="Delete question" placement="bottom">
            <Button
              type="link"
              style={{ color: '#DADADA' }}
              icon="delete"
              size="large"
              onClick={() => {
                const clonedQuestions = [...customQuestions];
                clonedQuestions.splice(idx, 1);
                setFieldTouched('questions');
                setFieldValue('questions', clonedQuestions);
                setCustomQuestions(clonedQuestions);
                setQuestionsCount(questionsCount - 1);
                mergeQuestionsToState(clonedQuestions);
              }}
            />
          </Tooltip>
        </StyledFormItem>
      ))}
      <Form.Item>
        <Button
          icon="plus-circle"
          size="large"
          onClick={() => {
            setQuestionsCount(questionsCount + 1);
            setCustomQuestions(customQuestions.concat(''));
          }}
        >
          New question
        </Button>
      </Form.Item>
    </>
  );
};

export default CustomQuestions;
