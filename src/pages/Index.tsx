import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import MagicalParticles from '@/components/MagicalParticles';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [magicalWord, setMagicalWord] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [allResults, setAllResults] = useState<any[]>([]);

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
    },
    {
      question: "Какой магический навык ты бы хотела освоить?",
      options: [
        { text: "Искусство запечатлевать моменты в вечности", value: "time" },
        { text: "Умение понимать язык книг, написанных тысячелетия назад", value: "ancient" },
        { text: "Способность создавать эликсиры, дарящие невесомость и покой", value: "alchemy" }
      ]
    },
    {
      question: "Напиши одно слово, которое ассоциируется у тебя с волшебством:",
      type: "text",
      placeholder: "Например: книги, уют, воспоминания..."
    },
    {
      question: "Какой волшебный предмет ты бы подарила близкому другу?",
      options: [
        { text: "Что-то, сделанное своими руками", value: "handmade" },
        { text: "То, что поможет осуществить мечту", value: "dream" },
        { text: "Что-то, что подарит мгновения блаженства", value: "bliss" }
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

  const saveTestResult = (userAnswers: string[], resultType: string) => {
    const testResult = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('ru-RU'),
      answers: userAnswers,
      result: resultType,
      artifact: artifacts[resultType as keyof typeof artifacts]
    };
    
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    existingResults.push(testResult);
    localStorage.setItem('quizResults', JSON.stringify(existingResults));
  };

  const loadAllResults = () => {
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setAllResults(results);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'arina2025') {
      setIsAdminAuth(true);
      setShowAdmin(true);
      loadAllResults();
    } else {
      alert('Неверный пароль!');
    }
  };

  const clearAllData = () => {
    if (confirm('Удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('quizResults');
      setAllResults([]);
      alert('Все данные удалены');
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Определяем результат
      const allAnswers = [...newAnswers, magicalWord];
      const counts = allAnswers.reduce((acc, answer) => {
        const category = getCategory(answer);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const result = Object.keys(counts).reduce((a, b) => 
        counts[a] > counts[b] ? a : b
      );
      
      // Сохраняем результат в localStorage
      saveTestResult(allAnswers, result);
      
      setCurrentStep(result);
    }
  };

  const handleTextAnswer = () => {
    if (magicalWord.trim()) {
      handleAnswer(magicalWord);
    }
  };

  const getCategory = (answer: string) => {
    // Анализируем текстовые ответы
    const lowerAnswer = answer.toLowerCase();
    if (['книг', 'знани', 'мудрост', 'учени', 'чтени'].some(word => lowerAnswer.includes(word))) return 'scroll';
    if (['воспомина', 'уют', 'тепл', 'дом', 'семь', 'любов'].some(word => lowerAnswer.includes(word))) return 'vessel';
    if (['магия', 'звезд', 'кристалл', 'свет', 'энерги'].some(word => lowerAnswer.includes(word))) return 'crystal';
    
    // Стандартные категории
    if (['scroll', 'knowledge', 'wisdom', 'ancient'].includes(answer)) return 'scroll';
    if (['crystal', 'craft', 'connection', 'time'].includes(answer)) return 'crystal';
    return 'vessel';
  };

  const resetQuiz = () => {
    setCurrentStep('intro');
    setAnswers([]);
    setCurrentQuestion(0);
    setMagicalWord('');
    setShowAnswers(false);
  };

  const getQuestionText = (qIndex: number, answer: string) => {
    if (qIndex === 4) return `"${answer}"`; // Текстовый ответ
    const question = questions[qIndex];
    if (question.options) {
      const option = question.options.find(opt => opt.value === answer);
      return option ? option.text : answer;
    }
    return answer;
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
        <MagicalParticles />
        <div className="max-w-2xl mx-auto text-center relative z-10">
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
                  ✨ Шесть вопросов раскроют твою внутреннюю сущность
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-white/80 mb-6">
                  <div className="flex items-center">
                    <Icon name="Clock" size={20} className="mr-2" />
                    <span>5 минут</span>
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
            
            {/* Скрытая кнопка админки */}
            <div className="mt-8">
              <Button 
                onClick={() => setShowAdmin(true)}
                variant="ghost"
                size="sm"
                className="text-white/40 hover:text-white/70 text-lg transition-colors hover:bg-white/10 px-4 py-2"
              >
                •••
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'quiz') {
    const currentQ = questions[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
        <MagicalParticles />
        <div className="max-w-2xl mx-auto relative z-10">
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
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentQ.type === 'text' ? (
                <div className="space-y-4">
                  <Input
                    placeholder={currentQ.placeholder}
                    value={magicalWord}
                    onChange={(e) => setMagicalWord(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder-white/60 text-lg p-4"
                    onKeyDown={(e) => e.key === 'Enter' && handleTextAnswer()}
                  />
                  <Button
                    onClick={handleTextAnswer}
                    disabled={!magicalWord.trim()}
                    className="w-full bg-white text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                  >
                    Продолжить
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </div>
              ) : (
                <RadioGroup onValueChange={handleAnswer} className="space-y-4">
                  {currentQ.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                      <RadioGroupItem value={option.value} id={option.value} className="border-white text-white" />
                      <Label htmlFor={option.value} className="text-white text-lg cursor-pointer flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const artifact = artifacts[currentStep as keyof typeof artifacts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      <MagicalParticles />
      <div className="max-w-2xl mx-auto text-center relative z-10">
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
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
                
                <Button 
                  onClick={() => setShowAnswers(!showAnswers)}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 rounded-full font-semibold hover-scale"
                >
                  <Icon name="Eye" size={20} className="mr-2" />
                  {showAnswers ? 'Скрыть' : 'Показать'} ответы
                </Button>
              </div>
              
              {showAnswers && (
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-left">
                  <CardHeader>
                    <CardTitle className="text-white text-lg font-[Caveat]">
                      Ответы Арины:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {answers.map((answer, index) => (
                        <div key={index} className="text-white/90">
                          <span className="font-semibold text-white">
                            {index + 1}. {questions[index]?.question}
                          </span>
                          <br />
                          <span className="ml-4 text-white/80">
                            ➜ {getQuestionText(index, answer)}
                          </span>
                        </div>
                      ))}
                      {magicalWord && (
                        <div className="text-white/90">
                          <span className="font-semibold text-white">
                            5. Магическое слово:
                          </span>
                          <br />
                          <span className="ml-4 text-white/80">
                            ➜ "{magicalWord}"
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Админ-панель */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Админ-панель</span>
                <Button 
                  onClick={() => {
                    setShowAdmin(false);
                    setIsAdminAuth(false);
                    setAdminPassword('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="X" size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isAdminAuth ? (
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Введите пароль админа"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                  <Button onClick={handleAdminLogin} className="w-full">
                    Войти
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      Всего прохождений: {allResults.length}
                    </h3>
                    <Button onClick={clearAllData} variant="destructive" size="sm">
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Очистить все
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {allResults.map((result, index) => (
                      <Card key={result.id} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              #{allResults.length - index} - {result.artifact.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {result.timestamp}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {result.answers.map((answer: string, qIndex: number) => (
                              <div key={qIndex}>
                                <strong>{questions[qIndex]?.question}</strong>
                                <br />
                                <span className="text-gray-600 ml-2">
                                  ➜ {getQuestionText(qIndex, answer)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {allResults.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        Пока никто не проходил тест
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;