'use client';

import { useState } from 'react';
import { diagnosisQuestions } from '@/lib/diagnosis-questions';
import { DiagnosisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Waves, Mountain, Sprout, Building2, Store, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// アイコンマッピング (お好みで追加・変更)
const iconMap: Record<string, React.ReactNode> = {
  ocean: <Waves className="w-8 h-8 text-blue-500" />,
  mountain: <Mountain className="w-8 h-8 text-green-600" />,
  nature: <Sprout className="w-8 h-8 text-emerald-500" />,
  farming: <Sprout className="w-8 h-8 text-amber-600" />,
  convenience: <Building2 className="w-8 h-8 text-indigo-500" />,
  unique: <Store className="w-8 h-8 text-purple-500" />,
  remote: <Home className="w-8 h-8 text-cyan-500" />,
  // デフォルト
  default: <Check className="w-6 h-6 text-gray-400" />
};

export function DiagnosisForm({ onComplete }: { onComplete: (result: DiagnosisResult) => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const currentQuestion = diagnosisQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === diagnosisQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / diagnosisQuestions.length) * 100;

  const handleAnswer = (value: string | string[]) => {
    // 次へ進む前に少し待機してもいいが、ここでは即時反映させる
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 診断結果を生成 (ロジックは既存のものを維持)
      const result: DiagnosisResult = {
        lifestyle: [],
        workStyle: [],
        priorities: [],
        budget: { min: 0, max: 50000000 },
        preferredRegions: [],
      };

      if (answers.lifestyle) {
        result.lifestyle = Array.isArray(answers.lifestyle) ? answers.lifestyle : [answers.lifestyle];
      }
      if (answers.workstyle) {
        result.workStyle = [answers.workstyle as string];
      }
      if (answers.priorities) {
        result.priorities = Array.isArray(answers.priorities) ? answers.priorities : [answers.priorities];
      }
      if (answers.budget) {
        const budgetValue = answers.budget as string;
        switch (budgetValue) {
          case '0-5': result.budget = { min: 0, max: 5000000 }; break;
          case '5-10': result.budget = { min: 5000000, max: 10000000 }; break;
          case '10-20': result.budget = { min: 10000000, max: 20000000 }; break;
          case '20+': result.budget = { min: 20000000, max: 50000000 }; break;
        }
      }

      // 推奨地域の判定 (三重県データに基づくマッピング)
      if (result.lifestyle.includes('ocean')) {
        result.preferredRegions.push('北牟婁郡紀北町', '鳥羽市', '志摩市');
      }
      if (result.lifestyle.includes('mountain') || result.lifestyle.includes('nature')) {
        result.preferredRegions.push('伊賀市', '名張市', '北牟婁郡紀北町');
      }
      if (result.lifestyle.includes('farming')) {
        result.preferredRegions.push('伊賀市', '松阪市', '名張市');
      }
      if (result.lifestyle.includes('convenience')) {
        result.preferredRegions.push('四日市市', '桑名市', '津市');
      }
      if (result.lifestyle.includes('unique')) {
        result.preferredRegions.push('伊賀市', '名張市'); 
      }
      result.preferredRegions = Array.from(new Set(result.preferredRegions));

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

  const getIcon = (value: string) => {
      // 簡易的なマッチング。value文字列の中にキーワードが含まれていればアイコンを返すなど
      for (const key in iconMap) {
          if (value.toLowerCase().includes(key)) return iconMap[key];
      }
      return iconMap.default;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>Question {currentQuestionIndex + 1}</span>
            <span>{diagnosisQuestions.length} Total</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-orange-400 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card overflow-hidden border-orange-100/50">
            <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-2xl font-bold mb-2">
                    {currentQuestion.question}
                </CardTitle>
                <CardDescription className="text-base">
                    {currentQuestion.type === 'multiple' ? '複数選択可能です' : '最も当てはまるものを1つ選んでください'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options?.map((option) => {
                  const isSelected = currentQuestion.type === 'multiple'
                    ? ((answers[currentQuestion.id] as string[]) || []).includes(option.value)
                    : answers[currentQuestion.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (currentQuestion.type === 'single') {
                          handleAnswer(option.value);
                          // シングル選択の場合は自動で次へ行かない（ユーザーに確認させるため、あえてボタン遷移にする）
                        } else {
                          const current = (answers[currentQuestion.id] as string[]) || [];
                          const next = current.includes(option.value)
                            ? current.filter(v => v !== option.value)
                            : [...current, option.value];
                          handleAnswer(next);
                        }
                      }}
                      className={cn(
                        "relative p-6 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 group",
                        isSelected 
                            ? "border-orange-500 bg-orange-50/50 shadow-md" 
                            : "border-transparent bg-white shadow-sm hover:border-orange-200 hover:shadow-md"
                      )}
                    >
                      <div className={cn(
                          "p-3 rounded-full transition-colors",
                          isSelected ? "bg-white" : "bg-gray-50 group-hover:bg-orange-50"
                      )}>
                          {getIcon(option.value)}
                      </div>
                      <div className="flex-1">
                          <span className={cn(
                              "text-lg font-bold block mb-1",
                              isSelected ? "text-orange-700" : "text-gray-700"
                          )}>
                              {option.label}
                          </span>
                      </div>
                      <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected ? "bg-orange-500 border-orange-500" : "border-gray-200"
                      )}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> 前へ
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={
                    !answers[currentQuestion.id] ||
                    (Array.isArray(answers[currentQuestion.id]) &&
                      (answers[currentQuestion.id] as string[]).length === 0)
                  }
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-full px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  {isLastQuestion ? '診断結果を見る' : '次へ'}
                  {!isLastQuestion && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}