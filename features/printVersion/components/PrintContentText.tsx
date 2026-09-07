/**
 * PrintContentText Component
 * محتوای متنی خبر در نسخه چاپی
 * 
 * @param content - آرایه‌ای از پاراگراف‌های متن
 */

'use client';



export interface PrintContentProps {
  content: string[];
}

// Component
export const PrintContentText = ({
  content,
}: PrintContentProps) => {
  return (
    <section className="flex flex-col items-end w-full py-6">
      {/* First paragraph - special styling */}
      {content.length > 0 && (
        <div className="flex flex-col items-end w-full mb-4">
          <p className="text-sm font-normal text-light-white text-right leading-6">
            {content[0]}
          </p>
        </div>
      )}
      
      {/* Rest of content */}
      {content.length > 1 && (
        <div className="flex flex-col gap-4 items-start w-full">
          {content.slice(1).map((paragraph, index) => (
            <div key={index} className="flex flex-col items-end w-full">
              <p className="text-sm font-normal text-light-white text-right leading-6 w-full">
                {paragraph}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};