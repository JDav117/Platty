export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return <div className={`flex justify-center items-center ${className}`}><div className={`animate-spin rounded-full border-2 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 ${sizes[size]}`} /></div>;
}
