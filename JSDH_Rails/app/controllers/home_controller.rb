
require 'prime'

class HomeController < ApplicationController

	protect_from_forgery :except => [:jsdh_prime]
	def index
		jsdh_init
	end

	def jsdh_prime
		logger.info params.to_json.to_s
		if params[:caa].present? and session[:jsdh_b].present? then
			jsdh_set_key if params[:caa] != 'none'
		end

		jsdh_init unless session[:jsdh_g].present?
		jsdh_init unless session[:jsdh_p].present?
		session[:jsdh_b] = rand_prime
		session[:jsdh_bb] = (session[:jsdh_g] **  session[:jsdh_b]) % session[:jsdh_p]
		render :json => {
			:bb => session[:jsdh_bb],
			:p => session[:jsdh_p],
			:g => session[:jsdh_g],
			:table => Prime.take(15)
		}
	end

	def key
		render :json => {
			:key => session[:jsdh_key]
		}
	end

protected
	
	def jsdh_init
		@jsdh_g = rand_number
		@jsdh_p = rand_prime

		session[:jsdh_key] = ''
		session[:jsdh_g] = @jsdh_g
		session[:jsdh_p] = @jsdh_p
	end

	def jsdh_set_key
		aa = params[:caa].to_i
		return false if aa < 1
		key = ( aa ** session[:jsdh_b] ) % session[:jsdh_p]
		session[:jsdh_key] = session[:jsdh_key] + key.to_s + 'x';
	end

	def rand_prime
		prime = Prime.take(19)
		offset = 1
		offset = offset + (rand * (prime.length - offset )).to_i - 2
		prime[offset]
	end

	def rand_number
		(rand * 5).to_i + 5
	end
end
