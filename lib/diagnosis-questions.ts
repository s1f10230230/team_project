import { DiagnosisQuestion } from './types';

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    id: 'lifestyle',
    question: 'どのようなライフスタイルを希望しますか？',
    type: 'multiple',
    options: [
      { value: 'nature', label: '自然に囲まれた生活' },
      { value: 'ocean', label: '海の近くで暮らしたい' },
      { value: 'mountain', label: '山の近くで暮らしたい' },
      { value: 'farming', label: '農業・家庭菜園をしたい' },
      { value: 'slow', label: 'スローライフを楽しみたい' },
    ],
    weight: 3,
  },
  {
    id: 'workstyle',
    question: 'お仕事のスタイルは？',
    type: 'single',
    options: [
      { value: 'remote', label: '完全リモートワーク' },
      { value: 'hybrid', label: 'ハイブリッド（週数日出社）' },
      { value: 'local', label: '現地で新しい仕事を探す' },
      { value: 'business', label: '起業・自営業' },
      { value: 'retired', label: 'リタイア・年金生活' },
    ],
    weight: 2,
  },
  {
    id: 'family',
    question: '家族構成を教えてください',
    type: 'single',
    options: [
      { value: 'single', label: '単身' },
      { value: 'couple', label: '夫婦のみ' },
      { value: 'small-family', label: '夫婦+子供（小学生以下）' },
      { value: 'teen-family', label: '夫婦+子供（中高生）' },
      { value: 'multi-gen', label: '三世代同居' },
    ],
    weight: 2,
  },
  {
    id: 'budget',
    question: '物件購入の予算は？',
    type: 'single',
    options: [
      { value: '0-5', label: '500万円以下' },
      { value: '5-10', label: '500万円〜1000万円' },
      { value: '10-20', label: '1000万円〜2000万円' },
      { value: '20+', label: '2000万円以上' },
    ],
    weight: 3,
  },
  {
    id: 'renovation',
    question: 'リフォーム・リノベーションについて',
    type: 'single',
    options: [
      { value: 'diy', label: 'DIYで自分でやりたい' },
      { value: 'partial', label: '必要最小限のリフォーム' },
      { value: 'full', label: 'プロに全面リフォーム依頼' },
      { value: 'ready', label: 'すぐ住める物件希望' },
    ],
    weight: 2,
  },
  {
    id: 'priorities',
    question: '重視するポイントは？（複数選択可）',
    type: 'multiple',
    options: [
      { value: 'education', label: '子育て・教育環境' },
      { value: 'medical', label: '医療施設の充実' },
      { value: 'transport', label: '交通の便' },
      { value: 'shopping', label: '買い物の便利さ' },
      { value: 'community', label: 'コミュニティ・人間関係' },
      { value: 'internet', label: 'インターネット環境' },
    ],
    weight: 2,
  },
  {
    id: 'timeline',
    question: '移住の時期は？',
    type: 'single',
    options: [
      { value: 'immediate', label: 'すぐにでも' },
      { value: '6months', label: '半年以内' },
      { value: '1year', label: '1年以内' },
      { value: '2years', label: '2年以内' },
      { value: 'future', label: '将来的に検討' },
    ],
    weight: 1,
  },
];