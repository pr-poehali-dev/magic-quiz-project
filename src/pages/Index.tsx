import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    {
      question: "Ты попадаешь в таинственную лавку древних реликвий. Что выберешь?",
      options: [
        { text: "Загадочный свиток с золотыми буквами", value: "scroll" },
        { text: "Блестящий кристалл с отражениями прошлого и будущего", value: "crystal" },
        { text: "Глиняный сосуд, наполняющийся теплом воспоминаний", value: "vessel" }
      ]
    },
    {
      question: "Какой магический ритуал тебе ближе?",
      options: [
        { text: "Создание оберега своими руками", value: "craft" },
        { text: "Чтение заклинаний из древнего фолианта", value: "knowledge" },
        { text: "Омовение в водах вечной молодости", value: "renewal" }
      ]
    },
    {
      question: "Что бы ты хотела найти в сундуке с сокровищами?",
      options: [
        { text: "Две фигурки, светящиеся в унисон", value: "connection" },
        { text: "Ключ в бесконечную библиотеку", value: "wisdom" },
        { text: "Ароматные эликсиры красоты", value: "beauty" }
      ]
    }
  ];

  const artifacts = {
    scroll: {
      name: "Свиток Древних Знаний",
      description: "Ты — носитель мудрости веков! Твоя душа жаждет знаний и готова раскрывать тайны мироздания.",
      image: "/img/8fe8f1bf-949f-4535-ad14-bb83e705a6e7.jpg"
    },
    crystal: {
      name: "Кристалл Пророчества",
      description: "Ты видишь то, что скрыто от других. Твоя интуиция — твоя сверхсила!",
      image: "/img/9270d4e7-c9d6-4e0c-9d37-146a80b7ee2a.jpg"
    },
    vessel: {
      name: "Сосуд Воспоминаний",
      description: "Ты хранитель эмоций и переживаний. Твоя душа полна тепла и сострадания.",
      image: "/img/de9ae067-f82e-48cd-bf3e-8ed90decd8ab.jpg"
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Определяем результат
      const counts = newAnswers.reduce((acc, answer) => {
        const category = getCategory(answer);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const result = Object.keys(counts).reduce((a, b) => 
        counts[a] > counts[b] ? a : b
      );
      
      setCurrentStep(result);
    }
  };

  const getCategory = (answer: string) => {
    if (['scroll', 'knowledge', 'wisdom'].includes(answer)) return 'scroll';
    if (['crystal', 'craft', 'connection'].includes(answer)) return 'crystal';
    return 'vessel';
  };

  const resetQuiz = () => {
    setCurrentStep('intro');
    setAnswers([]);
    setCurrentQuestion(0);
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="mb-8">
              <Icon name="Sparkles" size={64} className="mx-auto text-white mb-4" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[Caveat] animate-scale-in">
              Какой ты артефакт из волшебного мира?
            </h1>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 mb-8">
              <CardContent className="p-8">
                <p className="text-xl text-white/90 mb-6 leading-relaxed">
                  Пройди мини-тест, чтобы узнать, какой магический предмет подходит твоей душе!
                  ✨ Три вопроса раскроют твою внутреннюю сущность
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-white/80 mb-6">
                  <div className="flex items-center">
                    <Icon name="Clock" size={20} className="mr-2" />
                    <span>3 минуты</span>
                  </div>
                  <div className="flex items-center">
                    <Icon name="Heart" size={20} className="mr-2" />
                    <span>Для Арины</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => setCurrentStep('quiz')}
              className="bg-white text-purple-600 hover:bg-purple-50 text-xl px-8 py-4 rounded-full font-semibold shadow-lg hover-scale"
            >
              Начать магическое путешествие
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentQuestion ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/80">Вопрос {currentQuestion + 1} из {questions.length}</p>
          </div>

          <Card className="bg-white/20 backdrop-blur-sm border-white/30 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center font-[Caveat]">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={handleAnswer} className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <RadioGroupItem value={option.value} id={option.value} className="border-white text-white" />
                    <Label htmlFor={option.value} className="text-white text-lg cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const artifact = artifacts[currentStep as keyof typeof artifacts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="animate-scale-in">
          <div className="mb-6">
            <Icon name="Crown" size={64} className="mx-auto text-white mb-4" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[Caveat]">
            Твой магический артефакт:
          </h1>
          
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 mb-8">
            <CardContent className="p-8">
              <img 
                src={artifact.image} 
                alt={artifact.name}
                className="w-48 h-48 mx-auto rounded-full object-cover mb-6 shadow-2xl"
              />
              
              <h2 className="text-3xl font-bold text-white mb-4 font-[Caveat]">
                {artifact.name}
              </h2>
              
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                {artifact.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={resetQuiz}
                  className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-full font-semibold hover-scale"
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Пройти снова
                </Button>
                
                <Button 
                  onClick={() => {
                    const text = `Я прошла тест "Какой ты артефакт из волшебного мира?" и получила: ${artifact.name}! ${artifact.description}`;
                    navigator.share?.({ text }) || navigator.clipboard?.writeText(text);
                  }}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 rounded-full font-semibold hover-scale"
                >
                  <Icon name="Share2" size={20} className="mr-2" />
                  Поделиться
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;