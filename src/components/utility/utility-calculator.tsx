/**
 * 계산기 컴포넌트
 * @description 계산기 입력 폼과 결과 표시
 */
'use client';

import { useState, useCallback } from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UtilityInput, UtilityOutput } from '@/types/content';

interface UtilityCalculatorProps {
  inputs: UtilityInput[];
  outputs: UtilityOutput[];
  formulaKey: string;
  onCalculate: (inputs: Record<string, any>) => Promise<Record<string, any>>;
}

/**
 * UtilityCalculator: 계산기 입력 폼과 결과 표시 컴포넌트
 */
export default function UtilityCalculator({
  inputs,
  outputs,
  onCalculate,
}: UtilityCalculatorProps) {
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback((key: string, value: any) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
    setError(null); // 입력 변경 시 에러 초기화
  }, []);

  const handleCalculate = async () => {
    // 필수 입력값 검증
    const missingRequired = inputs
      .filter(input => input.required && !inputValues[input.key])
      .map(input => input.label);

    if (missingRequired.length > 0) {
      setError(`다음 항목을 입력해주세요: ${missingRequired.join(', ')}`);
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      const calculationResults = await onCalculate(inputValues);
      setResults(calculationResults);
    } catch (err) {
      setError('계산 중 오류가 발생했습니다. 입력값을 확인해주세요.');
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderInput = (input: UtilityInput) => {
    const value = inputValues[input.key] || '';

    switch (input.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            className="w-full p-3 border border-input rounded-md bg-background"
            required={input.required}
          >
            <option value="">선택하세요</option>
            {input.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            placeholder={input.placeholder}
            min={input.validation?.min}
            max={input.validation?.max}
            step="any"
            required={input.required}
            className="text-base"
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            required={input.required}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(input.key, e.target.value)}
            placeholder={input.placeholder}
            required={input.required}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>계산하기</span>
          </CardTitle>
          <CardDescription>
            필요한 정보를 입력하고 계산 버튼을 클릭하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {inputs.map((input) => (
            <div key={input.key} className="space-y-2">
              <label className="text-sm font-medium">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
                {input.unit && <span className="text-muted-foreground ml-2">({input.unit})</span>}
              </label>
              {renderInput(input)}
              {input.validation && (
                <p className="text-xs text-muted-foreground">
                  {input.validation.min !== undefined && `최소: ${input.validation.min}`}
                  {input.validation.max !== undefined && `, 최대: ${input.validation.max}`}
                </p>
              )}
            </div>
          ))}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
            size="lg"
          >
            {isCalculating ? '계산 중...' : '계산하기'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>계산 결과</CardTitle>
            <CardDescription>
              입력하신 정보에 따른 계산 결과를 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {outputs.map((output) => {
              const value = results[output.key];

              return (
                <div key={output.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{output.label}</h3>
                    <span className="text-2xl font-bold text-primary">
                      {typeof value === 'number'
                        ? output.type === 'percentage'
                          ? `${value.toFixed(2)}%`
                          : value.toLocaleString()
                        : value
                      }
                      {output.unit && <span className="text-base ml-1">{output.unit}</span>}
                    </span>
                  </div>

                  {output.description && (
                    <p className="text-sm text-muted-foreground">
                      {output.description}
                    </p>
                  )}

                  {output.interpretation && value && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm">
                        <strong>의미:</strong> {output.interpretation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
