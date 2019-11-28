import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Tooltip } from 'antd';

interface ICustomQuestions {
  isSubmitting: boolean,
  questions: string[],
  mergeQuestionsToState: (values: string[]) => void,
}

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-children {
    display: flex;
  }
`;

const CustomQuestions: React.FC<ICustomQuestions> = ({ isSubmitting, questions, mergeQuestionsToState }) => {
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
              setCustomQuestions(clonedQuestions);
              mergeQuestionsToState(clonedQuestions);
            }}
          />
          <Tooltip title="Delete question" placement="bottom">
            <Button
              type="link"
              icon="delete"
              size="large"
              onClick={() => {
                const clonedQuestions = [...customQuestions];
                clonedQuestions.splice(idx, 1);
                setCustomQuestions(clonedQuestions);
                setQuestionsCount(questionsCount - 1);
                mergeQuestionsToState(clonedQuestions);
              }}
            />
          </Tooltip>
        </StyledFormItem>
      ))}
      <div>
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
      </div>
    </>
  );
};

export default CustomQuestions;
