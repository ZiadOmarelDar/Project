import React from 'react';
import './PetFaqs.css';

const faqs = [
  {
    question: 'What should I prepare before adopting a pet?',
    answer:
      'You should prepare a safe home, budget for food and vet care, choose the right breed for your lifestyle, and have patience for training and bonding.',
  },
  {
    question: 'Is it better to adopt a puppy or kitten, or an adult pet?',
    answer:
      'Adult pets are often already trained and socialized. Puppies and kittens require more time and effort but offer early bonding. It depends on your lifestyle and preference.',
  },
  {
    question: 'Can I adopt a pet if I live in an apartment?',
    answer:
      'Yes! Many pets, including smaller dog breeds and cats, adapt well to apartment living as long as their exercise and mental needs are met.',
  },
  {
    question: 'What if I already have other pets at home?',
    answer:
      'Introduce new pets gradually. Use separate spaces at first and monitor their interactions. Most pets adjust well with proper introduction and time.',
  },
  {
    question: 'How much does it cost to adopt and care for a pet?',
    answer:
      'Initial adoption fees range from $50–$300. Ongoing costs for food, vet care, grooming, and supplies can be $500–$1,000+ per year depending on the pet.',
  },
  {
    question: 'What are the benefits of adopting over buying a pet?',
    answer:
      'Adoption gives a homeless pet a second chance and helps reduce overpopulation. It’s often more affordable and rewarding than buying.',
  },
];

const PetFaqs = () => {
  return (
    <div className="faq-wrapper">
      <h1 className="faq-title">PET ADOPTION FAQS</h1>
      {faqs.map((faq, index) => (
        <details key={index} className="faq-item">
          <summary>{faq.question}</summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default PetFaqs;
