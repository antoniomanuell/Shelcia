import React, { useState, useEffect } from 'react';
import { Trophy, Users, BookOpen, Play, LogOut, Settings, Clock, Target, Zap, Crown, Star, ChevronRight, Plus, Search, Filter } from 'lucide-react';

// Configuração da API
const API_BASE = 'https://apikwizz.sharingancode.site/api/v1';

// Componente de Loading
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="w-8 h-8 text-yellow-400" />
      </div>
    </div>
  </div>
);

// Componente de Login
const LoginScreen = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const body = isRegister 
        ? { name, phone, password, password_confirmation: password }
        : { phone, password };
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      if (data.success && data.token) {
        onLogin(data.token, data.data);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-4 shadow-2xl">
            <Zap className="w-12 h-12 text-blue-900" />
          </div>
          <h1 className="text-6xl font-black text-white mb-2 tracking-tight">Kwiz</h1>
          <p className="text-blue-200 text-lg font-medium">Aprenda jogando, conquiste conhecendo</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all transform ${
                !isRegister 
                  ? 'bg-yellow-400 text-blue-900 shadow-lg scale-105' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all transform ${
                isRegister 
                  ? 'bg-yellow-400 text-blue-900 shadow-lg scale-105' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}
            >
              Registrar
            </button>
          </div>
          
          <div className="space-y-4">
            {isRegister && (
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                required
              />
            )}
            
            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              required
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              required
            />
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-yellow-400 text-blue-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Carregando...' : isRegister ? 'Criar Conta' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Dashboard
const Dashboard = ({ token, user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [quizzes, setQuizzes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (activeTab === 'quizzes') {
        const res = await fetch(`${API_BASE}/quizzes`, { headers });
        const data = await res.json();
        setQuizzes(data.data || []);
      } else if (activeTab === 'turmas') {
        const res = await fetch(`${API_BASE}/turms`, { headers });
        const data = await res.json();
        setTurmas(data || []);
      } else if (activeTab === 'stats' && user?.id) {
        const res = await fetch(`${API_BASE}/get-user-overall-stats/${user.id}`, { headers });
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Kwiz</h1>
              <p className="text-xs text-blue-200">Olá, {user?.name || 'Jogador'}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-yellow-400/20 px-4 py-2 rounded-full border border-yellow-400/30">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{stats?.totalAchievements || 0} XP</span>
            </div>
            
            <button
              onClick={onLogout}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all transform hover:scale-110"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-xl">
          <TabButton
            active={activeTab === 'quizzes'}
            onClick={() => setActiveTab('quizzes')}
            icon={BookOpen}
            label="Meus Quizzes"
          />
          <TabButton
            active={activeTab === 'turmas'}
            onClick={() => setActiveTab('turmas')}
            icon={Users}
            label="Turmas"
          />
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={Trophy}
            label="Estatísticas"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'quizzes' && <QuizzesView quizzes={quizzes} token={token} />}
            {activeTab === 'turmas' && <TurmasView turmas={turmas} token={token} />}
            {activeTab === 'stats' && <StatsView stats={stats} />}
          </>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all transform ${
      active
        ? 'bg-yellow-400 text-blue-900 shadow-lg scale-105'
        : 'text-white hover:bg-white/10 hover:scale-105'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// View de Quizzes
const QuizzesView = ({ quizzes, token }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [gameSession, setGameSession] = useState(null);

  const startQuiz = async (quiz) => {
    try {
      const response = await fetch(`${API_BASE}/game-sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quiz_id: quiz.id, title: quiz.title })
      });
      
      const data = await response.json();
      if (data.success) {
        setGameSession(data);
        setSelectedQuiz(quiz);
      }
    } catch (error) {
      console.error('Start quiz error:', error);
    }
  };

  if (gameSession) {
    return <GameView session={gameSession} token={token} onExit={() => setGameSession(null)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <BookOpen className="w-20 h-20 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-bold">Nenhum quiz encontrado</p>
          <p className="text-white/40 text-sm mt-2">Crie seu primeiro quiz para começar!</p>
        </div>
      ) : (
        quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer group shadow-xl"
            onClick={() => startQuiz(quiz)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{quiz.title}</h3>
                <p className="text-blue-200 text-sm line-clamp-2">{quiz.description || 'Sem descrição'}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-6 h-6 text-blue-900" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-blue-200 mb-4">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{quiz.questions?.length || 0} questões</span>
              </div>
              {quiz.isTimerEnabled && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Cronometrado</span>
                </div>
              )}
            </div>
            
            <button className="w-full py-3 bg-yellow-400 text-blue-900 rounded-xl font-bold hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform group-hover:scale-105">
              <Play className="w-5 h-5" />
              Jogar Agora
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// View de Turmas
const TurmasView = ({ turmas, token }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {turmas.length === 0 ? (
        <div className="col-span-full text-center py-20">
          <Users className="w-20 h-20 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg font-bold">Nenhuma turma encontrada</p>
          <p className="text-white/40 text-sm mt-2">Entre em uma turma ou crie a sua!</p>
        </div>
      ) : (
        turmas.map((turma) => (
          <div
            key={turma.id}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer shadow-xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-blue-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{turma.name}</h3>
                <p className="text-blue-200 text-sm font-mono">Código: {turma.code}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-blue-200">
              <span className="font-medium">{turma.members?.length || 0} membros</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// View de Estatísticas
const StatsView = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={BookOpen}
        label="Quizzes Concluídos"
        value={stats?.totalQuizzes || 0}
        color="bg-blue-500"
      />
      <StatCard
        icon={Target}
        label="Pontuação Média"
        value={`${stats?.averageScore || 0}%`}
        color="bg-yellow-500"
      />
      <StatCard
        icon={Trophy}
        label="Conquistas"
        value={stats?.totalAchievements || 0}
        color="bg-purple-500"
      />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:scale-105 transition-transform">
    <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-blue-200 text-sm mb-1 font-medium">{label}</p>
    <p className="text-4xl font-black text-white">{value}</p>
  </div>
);

// Componente de Jogo
const GameView = ({ session, token, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (currentQuestion && timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
      setTimeout(nextQuestion, 2000);
    }
  }, [timeLeft, isAnswered, currentQuestion]);

  const startGame = async () => {
    try {
      const response = await fetch(`${API_BASE}/game-sessions/${session.code}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_timer_enabled: true })
      });
      
      const data = await response.json();
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        setTimeLeft(data.question.time_limit || 30);
      }
    } catch (error) {
      console.error('Start game error:', error);
    }
  };

  const submitAnswer = async (answerId, optionIsCorrect) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerId);
    setIsAnswered(true);
    setIsCorrect(optionIsCorrect);
    setShowResult(true);

    try {
      const response = await fetch(`${API_BASE}/game-sessions/${session.code}/answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer_id: answerId,
          question_id: currentQuestion.id,
          time: timeLeft
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setScore(prev => prev + (data.points || 0));
        
        setTimeout(() => {
          setShowResult(false);
          nextQuestion();
        }, 2000);
      }
    } catch (error) {
      console.error('Submit answer error:', error);
    }
  };

  const nextQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE}/game-sessions/${session.code}/next`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setTimeLeft(data.question.time_limit || 30);
        setQuestionIndex(prev => prev + 1);
      } else {
        endGame();
      }
    } catch (error) {
      console.error('Next question error:', error);
      endGame();
    }
  };

  const endGame = () => {
    onExit();
  };

  if (!currentQuestion) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-white">
              <span className="text-sm text-blue-200 font-medium">Questão</span>
              <p className="text-2xl font-black">{questionIndex + 1}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 10 ? 'bg-red-500/20 animate-pulse' : 'bg-yellow-400/20'
            }`}>
              <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`} />
              <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{score}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-3 rounded-full transition-all duration-1000 ${
              timeLeft <= 10 ? 'bg-red-500' : 'bg-yellow-400'
            }`}
            style={{ width: `${(timeLeft / (currentQuestion.time_limit || 30)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8 leading-tight">
          {currentQuestion.text}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrectOption = option.is_correct;
            
            let bgColor = 'bg-white/10 hover:bg-white/20';
            let borderColor = 'border-white/20';
            let textColor = 'text-white';
            
            if (showResult) {
              if (isCorrectOption) {
                bgColor = 'bg-green-500/80';
                borderColor = 'border-green-400';
              } else if (isSelected) {
                bgColor = 'bg-red-500/80';
                borderColor = 'border-red-400';
              }
            } else if (isSelected) {
              bgColor = 'bg-yellow-400/80';
              borderColor = 'border-yellow-400';
            }
            
            return (
              <button
                key={option.id}
                onClick={() => submitAnswer(option.id, isCorrectOption)}
                disabled={isAnswered}
                className={`${bgColor} p-6 rounded-2xl border-2 ${borderColor} transition-all hover:scale-105 disabled:cursor-not-allowed text-left group shadow-lg transform ${
                  !isAnswered && 'hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${
                    showResult && isCorrectOption ? 'bg-white text-green-500' :
                    showResult && isSelected ? 'bg-white text-red-500' :
                    isSelected ? 'bg-blue-900 text-yellow-400' :
                    'bg-white/20 text-white group-hover:bg-white/30'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`${textColor} font-bold text-lg flex-1`}>{option.text}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {showResult && (
          <div className={`mt-6 p-4 rounded-xl text-center font-bold text-lg ${
            isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {isCorrect ? '✓ Correto! Parabéns!' : '✗ Resposta incorreta'}
          </div>
        )}
      </div>

      <button
        onClick={endGame}
        className="w-full py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/20 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Sair do Jogo
      </button>
    </div>
  );
};

// App Principal
export default function App() {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kwiz_token');
    }
    return null;
  });
  
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kwiz_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kwiz_token', newToken);
      localStorage.setItem('kwiz_user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kwiz_token');
      localStorage.removeItem('kwiz_user');
    }
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard token={token} user={user} onLogout={handleLogout} />;
}