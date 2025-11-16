"use client";

import { PostCard } from "@/components/forum/post-card";
import { Button } from "@/components/ui/button";
import { PenSquare, X } from "lucide-react";
import { type Post } from "@/lib/types";
import React, { useState } from "react";

const mockPosts: Post[] = [
	{
		id: "1",
		author: "Anonymous Panda",
		title: "Feeling overwhelmed with school work",
		content: "Lately, the pressure from school has been too much. I feel like I can't keep up and it's making me really anxious. Does anyone else feel this way? How do you cope?",
		comments: 5,
		timestamp: "2 hours ago",
	},
	{
		id: "2",
		author: "Anonymous Capybara",
		title: "A small win today!",
		content: "I've been struggling to get out of bed, but today I managed to go for a short walk and it felt really good. Just wanted to share a small moment of positivity.",
		comments: 12,
		timestamp: "8 hours ago",
	},
	{
		id: "3",
		author: "Anonymous Fox",
		title: "How to deal with feeling lonely?",
		content: "I moved to a new city and I'm finding it hard to make friends. It gets really lonely sometimes. Any advice on meeting new people or dealing with loneliness?",
		comments: 8,
		timestamp: "1 day ago",
	},
];

export default function ForumPage() {
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [posts, setPosts] = useState<Post[]>(mockPosts);

	const handleCreatePost = (title: string, content: string, author: string) => {
		const newPost: Post = {
			id: (posts.length + 1).toString(),
			author: author || "Anonymous",
			title,
			content,
			comments: 0,
			timestamp: "Just now",
		};
		setPosts([newPost, ...posts]);
		setShowCreatePost(false);
	};

	return (
		<div className="p-4 md:p-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold font-headline">Support Forum</h1>
					<p className="text-lg text-muted-foreground">A safe and anonymous space to share and connect.</p>
				</div>
				<Button onClick={() => setShowCreatePost(true)}>
					<PenSquare className="mr-2 h-4 w-4" />
					Create Post
				</Button>
			</div>

			{showCreatePost && (
				<div className="mb-8 bg-white shadow-lg rounded-lg p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Create New Post</h2>
						<Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
							<X className="h-4 w-4" />
						</Button>
					</div>
					<PostComposer onSubmit={handleCreatePost} />
				</div>
			)}

			<div className="space-y-6">
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}

function PostComposer({ onSubmit }: { onSubmit: (title: string, content: string, author: string) => void }) {
	const [name, setName] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [post, setPost] = useState<string>("");
	const maxLength = 1000;

	function handleSubmit(e?: React.FormEvent) {
		e?.preventDefault();
		if (!post.trim() || !title.trim()) return;
		onSubmit(title, post, name);
		setTitle("");
		setPost("");
		setName("");
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label className="block text-sm font-medium mb-1">Your name (optional)</label>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Enter your name or stay anonymous"
					className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Post title</label>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="What would you like to share?"
					className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div>
				<label className="block text-sm font-medium mb-1">Your post</label>
				<textarea
					value={post}
					onChange={(e) => setPost(e.target.value)}
					placeholder="Share your thoughts, experiences, or ask for support..."
					maxLength={maxLength}
					rows={5}
					className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<div className="text-sm text-gray-500 mt-1">{post.length}/{maxLength} characters</div>
			</div>

			<div className="flex justify-end gap-2">
				<Button type="submit" disabled={!post.trim() || !title.trim()}>
					Share Post
				</Button>
			</div>
		</form>
	);
}
    
 
