'use client';

import { useState } from 'react';
import { diagnosisQuestions } from '@/lib/diagnosis-questions';
import { DiagnosisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DiagnosisForm({ onComplete }: { onComplete: (result: DiagnosisResult) => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentQuestion = diagnosisQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === diagnosisQuestions.length - 1;

  const handleAnswer = (value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 診断結果を生成
      const result: DiagnosisResult = {
        lifestyle: [],
        workStyle: [],
        priorities: [],
        budget: { min: 0, max: 50000000 },
        preferredRegions: [],
      };

      // ライフスタイルの解析
      if (answers.lifestyle) {
        result.lifestyle = Array.isArray(answers.lifestyle)
          ? answers.lifestyle
          : [answers.lifestyle];
      }

      // ワークスタイルの解析
      if (answers.workstyle) {
        result.workStyle = [answers.workstyle as string];
      }

      // 優先事項の解析
      if (answers.priorities) {
        result.priorities = Array.isArray(answers.priorities)
          ? answers.priorities
          : [answers.priorities];
      }

      // 予算の解析
      if (answers.budget) {
        const budgetValue = answers.budget as string;
        switch (budgetValue) {
          case '0-5':
            result.budget = { min: 0, max: 5000000 };
            break;
          case '5-10':
            result.budget = { min: 5000000, max: 10000000 };
            break;
          case '10-20':
            result.budget = { min: 10000000, max: 20000000 };
            break;
          case '20+':
            result.budget = { min: 20000000, max: 50000000 };
            break;
        }
      }

      // 推奨地域の判定
      if (result.lifestyle.includes('ocean')) {
        result.preferredRegions.push('region-2');
      }
      if (result.lifestyle.includes('mountain') || result.lifestyle.includes('nature')) {
        result.preferredRegions.push('region-1', 'region-3');
      }
      if (result.lifestyle.includes('farming')) {
        result.preferredRegions.push('region-3');
      }

      onComplete(result);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderOptions = () => {
    if (!currentQuestion.options) return null;

    if (currentQuestion.type === 'single') {
      return (
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 ${
                answers[currentQuestion.id] === option.value ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'multiple') {
      const selectedValues = (answers[currentQuestion.id] as string[]) || [];
      return (
        <div className="space-y-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const newValues = selectedValues.includes(option.value)
                  ? selectedValues.filter((v) => v !== option.value)
                  : [...selectedValues, option.value];
                handleAnswer(newValues);
              }}
              className={`w-full text-left p-3 border rounded-lg hover:bg-gray-50 ${
                selectedValues.includes(option.value) ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          質問 {currentQuestionIndex + 1} / {diagnosisQuestions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
          {currentQuestion.type === 'multiple' && (
            <p className="text-sm text-gray-600">※複数選択可</p>
          )}
          {renderOptions()}
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              前へ
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                !answers[currentQuestion.id] ||
                (Array.isArray(answers[currentQuestion.id]) &&
                  (answers[currentQuestion.id] as string[]).length === 0)
              }
            >
              {isLastQuestion ? '診断結果を見る' : '次へ'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}