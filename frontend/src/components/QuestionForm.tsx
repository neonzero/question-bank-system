import { useForm } from 'react-hook-form';
import { api } from '../services/api';

const QuestionForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    data.options = [data.option1, data.option2, data.option3, data.option4];
    data.correctAnswer = parseInt(data.correctAnswer) - 1;
    await api.post('/questions', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('text')} placeholder="Question Text" />
      <input {...register('option1')} placeholder="Option 1" />
      <input {...register('option2')} placeholder="Option 2" />
      <input {...register('option3')} placeholder="Option 3" />
      <input {...register('option4')} placeholder="Option 4" />
      <input {...register('correctAnswer')} placeholder="Correct (1-4)" />
      <input {...register('explanation')} placeholder="Explanation" />
      <input {...register('domain')} placeholder="Domain" />
      <input {...register('difficulty')} placeholder="Difficulty" />
      <button type="submit">Add Question</button>
    </form>
  );
};

export default QuestionForm;
