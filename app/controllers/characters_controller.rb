class CharactersController < ApplicationController
  def show
    @character = Character.find(params[:id])
    respond_to do |format|
      format.json{
        render status: 200, json: {
          character: @character.to_json 
        }
      }
    end
  end

  def index
    @characters = Character.limit(5).offset(params[:start])
    respond_to do |format|
      format.json{
        render status: 200, json: {
          character: @characters
        }
      }
    end
  end


end
