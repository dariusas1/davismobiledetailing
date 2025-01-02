import React from 'react';
import './Blog.css';

const blogPosts = [
    {
        title: 'Top 5 Tips for Maintaining Your Car\'s Shine',
        excerpt: 'Learn how to keep your vehicle looking brand new between professional details.',
        date: '2024-01-15',
        readTime: '3 min read'
    },
    {
        title: 'Why Ceramic Coating is Worth the Investment',
        excerpt: 'Discover the long-term benefits of ceramic coating for your vehicle\'s paint.',
        date: '2024-02-01',
        readTime: '4 min read'
    },
    {
        title: 'Seasonal Car Care: Protecting Your Vehicle Year-Round',
        excerpt: 'Essential maintenance tips for every season to preserve your car\'s appearance and value.',
        date: '2024-03-10',
        readTime: '5 min read'
    }
];

const Blog = () => {
    return (
        <section className="blog">
            <div className="blog-heading">
                <h2>Car Care Blog</h2>
                <p>Expert tips and insights from Precision Detailing</p>
            </div>
            <div className="blog-grid">
                {blogPosts.map((post, index) => (
                    <div key={index} className="blog-post">
                        <div className="blog-post-header">
                            <span className="blog-post-date">{post.date}</span>
                            <span className="blog-post-read-time">{post.readTime}</span>
                        </div>
                        <h3 className="blog-post-title">{post.title}</h3>
                        <p className="blog-post-excerpt">{post.excerpt}</p>
                        <button className="read-more-btn">Read More</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Blog;
